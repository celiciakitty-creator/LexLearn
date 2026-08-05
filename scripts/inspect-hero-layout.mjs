import { chromium } from "playwright";

const widths = [375, 768, 1440];

function chainStyles(el) {
  const chain = [];
  let node = el;
  while (node && node.nodeType === 1) {
    const cs = getComputedStyle(node);
    const rect = node.getBoundingClientRect();
    chain.push({
      tag: node.tagName.toLowerCase(),
      id: node.id || null,
      className: typeof node.className === "string" ? node.className.slice(0, 120) : null,
      top: Math.round(rect.top * 10) / 10,
      bottom: Math.round(rect.bottom * 10) / 10,
      height: Math.round(rect.height * 10) / 10,
      marginTop: cs.marginTop,
      marginBottom: cs.marginBottom,
      paddingTop: cs.paddingTop,
      paddingBottom: cs.paddingBottom,
      position: cs.position,
      overflow: cs.overflow,
      overflowY: cs.overflowY,
      transform: cs.transform,
      translate: cs.translate,
      minHeight: cs.minHeight,
      alignItems: cs.alignItems,
      scrollMarginTop: cs.scrollMarginTop,
    });
    if (node.tagName === "BODY") break;
    node = node.parentElement;
  }
  return chain;
}

const browser = await chromium.launch();
for (const width of widths) {
  const page = await browser.newPage({ viewport: { width, height: 900 } });
  await page.goto("http://localhost:3000/", { waitUntil: "networkidle", timeout: 30000 });
  await page.waitForTimeout(1500);

  const report = await page.evaluate(() => {
    const header = document.querySelector("header");
    const heading = document.getElementById("hero-heading");
    const eyebrow = heading?.previousElementSibling ?? null;
    const buttons = heading?.parentElement?.querySelector(".mt-8") ?? null;

    function chainStyles(el) {
      const chain = [];
      let node = el;
      while (node && node.nodeType === 1) {
        const cs = getComputedStyle(node);
        const rect = node.getBoundingClientRect();
        chain.push({
          tag: node.tagName.toLowerCase(),
          id: node.id || null,
          className: typeof node.className === "string" ? node.className.slice(0, 120) : null,
          top: Math.round(rect.top * 10) / 10,
          bottom: Math.round(rect.bottom * 10) / 10,
          height: Math.round(rect.height * 10) / 10,
          marginTop: cs.marginTop,
          paddingTop: cs.paddingTop,
          position: cs.position,
          overflow: cs.overflow,
          overflowY: cs.overflowY,
          transform: cs.transform,
          minHeight: cs.minHeight,
          alignItems: cs.alignItems,
          scrollMarginTop: cs.scrollMarginTop,
        });
        if (node.tagName === "BODY") break;
        node = node.parentElement;
      }
      return chain;
    }

    function isClipped(el) {
      if (!el) return null;
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const points = [
        ["top", cx, rect.top + 1],
        ["mid", cx, rect.top + rect.height / 2],
        ["bottom", cx, rect.bottom - 1],
      ];
      const results = {};
      for (const [name, x, y] of points) {
        const hit = document.elementFromPoint(x, y);
        results[name] = {
          hit: hit
            ? `${hit.tagName.toLowerCase()}${hit.id ? `#${hit.id}` : ""}${hit.className && typeof hit.className === "string" ? `.${hit.className.split(" ")[0]}` : ""}`
            : null,
          containsTarget: hit ? el.contains(hit) || hit === el : false,
        };
      }
      return results;
    }

    const headerBottom = header?.getBoundingClientRect().bottom ?? 0;

    return {
      scrollY: window.scrollY,
      headerBottom,
      headerHeight: header?.offsetHeight ?? null,
      cssVarHeader: getComputedStyle(document.documentElement).getPropertyValue("--site-header-height").trim(),
      eyebrow: eyebrow
        ? {
            top: eyebrow.getBoundingClientRect().top,
            aboveHeader: eyebrow.getBoundingClientRect().top < headerBottom - 0.5,
            chain: chainStyles(eyebrow),
            clipped: isClipped(eyebrow),
          }
        : null,
      heading: heading
        ? {
            top: heading.getBoundingClientRect().top,
            aboveHeader: heading.getBoundingClientRect().top < headerBottom - 0.5,
            chain: chainStyles(heading),
            clipped: isClipped(heading),
          }
        : null,
      buttons: buttons
        ? {
            top: buttons.getBoundingClientRect().top,
            bottom: buttons.getBoundingClientRect().bottom,
            aboveHeader: buttons.getBoundingClientRect().top < headerBottom - 0.5,
            clipped: isClipped(buttons),
          }
        : null,
      heroSection: (() => {
        const hero = document.getElementById("hero");
        if (!hero) return null;
        const cs = getComputedStyle(hero);
        const rect = hero.getBoundingClientRect();
        return {
          top: rect.top,
          paddingTop: cs.paddingTop,
          overflow: cs.overflow,
          scrollMarginTop: cs.scrollMarginTop,
        };
      })(),
    };
  });

  console.log(`\n=== WIDTH ${width} ===`);
  console.log(JSON.stringify(report, null, 2));
  await page.close();
}
await browser.close();
