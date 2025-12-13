export default defineAppConfig({
  ui: {
    colors: { primary: 'neutral', neutral: 'stone' },
    card: {
      slots: {
        root: 'rounded-none border bg-card text-card-foreground shadow-sm',
        header: 'flex flex-col space-y-1.5 p-6',
        body: 'p-6 pt-0',
        footer: 'flex items-center p-6 pt-0',
      },
      variants: {
        variant: {
          outline: { root: '' },
        },
      },
    },
    button: {
      slots: {
        base: 'rounded-none font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
      },
      variants: {
        size: {
          md: { base: 'h-10 px-4 py-2 text-sm gap-2' },
        },
        variant: {
          solid: { base: 'bg-primary text-primary-foreground hover:bg-primary/90' },
          outline: { base: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground' },
        },
      },
      defaultVariants: {
        size: 'md',
      },
    },
    input: {
      slots: {
        root: 'w-full',
        base: 'w-full h-9 rounded-none border border-input bg-transparent px-3 py-1 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50',
      },
      variants: {
        variant: {
          outline: { base: '' },
          none: { base: '' },
        },
      },
      defaultVariants: {
        variant: 'outline',
      },
    },
    checkbox: {
      slots: {
        root: 'flex items-center gap-2',
        base: 'size-4 shrink-0 rounded-[4px] border border-input shadow-xs transition-shadow outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground data-[state=checked]:border-primary',
        indicator: 'flex items-center justify-center text-current',
        icon: 'size-3.5',
        label: 'text-sm font-medium leading-none',
      },
    },
  },
})
