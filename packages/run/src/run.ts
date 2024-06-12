import minimist from "minimist";
import _ from 'lodash-es'

type Cmd = (option: Record<string, any>) => Promise<any> | any;
export type CmdMap = {
  [cmd: string]: Cmd | CmdMap;
};

function createProxy(object: Object) {
  return new Proxy(object, {
    apply(target: (...args: any[]) => any, thisArg, argArray) {
      return Reflect.apply(target, thisArg, argArray);
    },
    get(target, prop: string, receiver) {
      if (prop in target) {
        return Reflect.get(target, prop, receiver);
      }
      if ('default' in target) {
        return Reflect.get(target, 'default', receiver);
      }
      throw new Error(`no such command: ${prop}`);
    }
  })
}

export async function run(cmdMap: CmdMap, ministOpts?: minimist.Opts) {
  const proxyCmdMap = createProxy(cmdMap) as CmdMap
  const argv = minimist(process.argv.slice(2), ministOpts);
  if (argv.help) {
    console.log(proxyCmdMap);
    return;
  }
  const subCmds: string[] | undefined = argv._;
  if (!subCmds) {
    throw new Error(
      `caution:subcommand is needed. and handler current is ${subCmds}`
    );
  }
  if (subCmds.length === 0) {
    console.log("caution:subcommand is needed");
    return;
  }
  try {
    let myProxyCmdMap = proxyCmdMap
    for (const cmd of subCmds) {
      const _cmdMapOrFn = myProxyCmdMap[cmd];
      if (_.isFunction(_cmdMapOrFn)) {
        await _cmdMapOrFn.call(myProxyCmdMap, argv);
        return;
      }
      if (_.isObject(_cmdMapOrFn)) {
        myProxyCmdMap = _cmdMapOrFn as CmdMap;
        continue;
      }
      throw new Error(`no such command: ${cmd} of ${subCmds.join('=>')}`);
    }
  } catch (e) {
    console.error(e);
  }
}
