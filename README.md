# Getting Started

```bash
npm install -g @autoclickpro/rpa
```

# Usage

```javascript
import { rpa } from "@autoclickpro/rpa";
await rpa.clickText("button");
await rpa.clickIcon("button/login");
await rpa.click({ x: 100, y: 100 }); //click Point on screen
```

# CAUTION

@autoclickpro will capture the screen of your computer and send it to OCR server, but the server will not store the screenshot. If you care about it ,please DON NOT use it for confidential cases

# More

@autoclickpro use https://github.com/nut-tree/nut.js as the core library, you can find more API in nut.js
