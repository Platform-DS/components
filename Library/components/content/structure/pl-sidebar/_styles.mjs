// ------------------------------
// Sidebar Styles — LIGHT DOM
// ------------------------------
// A wrapping flex row, not a grid with a breakpoint. The aside asks for a fixed
// basis while the main column asks for everything left over and refuses to go
// below --sidebar-content-min; when it cannot have that, flex-wrap drops the
// aside onto its own line.
//
// The switch therefore happens when the CONTENT actually runs out of room,
// with no query of any kind. That matters because a viewport query would keep
// two columns inside a narrow parent on a wide screen, and a container query
// cannot restyle its own container — which is what this element would need to
// change its own layout.

export const STYLES = /*css*/`
@layer pl-components {
  pl-sidebar {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-start;
    gap: var(--sidebar-gap, var(--pl-size-32, 2rem));
  }

  pl-sidebar[hidden] { display: none; }

  /* The narrow column: a preferred width it can grow past only if alone. */
  pl-sidebar > [data-aside] {
    flex: 1 1 var(--sidebar-width, 16rem);
  }

  /* The main column: takes everything spare, and forces the wrap the moment it
     would be squeezed below this share of the row.

     50%, not something larger. The two columns share one line only while
     min + sidebar-width + gap fits, so this threshold IS the breakpoint:
     at 60% a 16rem aside would need a ~720px container before it ever sat
     alongside, which is most of the way to a laptop. Half leaves the switch
     at around 580px, where a two-column layout genuinely stops working. */
  pl-sidebar > :not([data-aside]) {
    flex: 999 1 0;
    min-inline-size: var(--sidebar-content-min, 50%);
  }
}
`;
