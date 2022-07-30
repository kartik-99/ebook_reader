let styles = {
  body: {
    background: '#fafafa',
    color: '#121212',
    'font-family': 'Default',
    'font-size': '100%',
    'line-height': 'normal',
  },
  p: {
    color: '#ffffff',
    'font-family': 'Default',
    'font-size': '100%',
    'line-height': 'normal',
  },
  li: {
    color: '#ffffff',
    'font-family': 'Default',
    'font-size': '100%',
    'line-height': 'normal',
  },
  h1: {
    color: '#ffffff',
  },
};

export function themeToStyles(theme) {
  styles.body = {
    background: theme.bg,
    color: theme.fg,
    'font-family': theme.font,
    'font-size': theme.size,
    'line-height': theme.height,
  };
  styles.p = {
    color: theme.fg,
    'font-family': theme.font,
    'font-size': theme.size,
    'line-height': theme.height,
  };
  styles.li = {
    color: theme.fg,
    'font-family': theme.font,
    'font-size': theme.size,
    'line-height': theme.height,
  };
  styles.h1.color = theme.fg;
  return styles;
}

export function mapBgToFg(color) {
  color = +('0x' + color.slice(1).replace(color.length < 5 && /./g, '$&$&'));
  let r = color >> 16;
  let g = (color >> 8) & 255;
  let b = color & 255;
  let hsp = Math.sqrt(0.299 * (r * r) + 0.587 * (g * g) + 0.114 * (b * b));
  return hsp > 127.5 ? '#000000' : '#ffffff';
}
