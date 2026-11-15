// state: 'default' (inset slot), 'selected' (teal border) or 'done' (flat, dimmed).
export default function Card({ as: Tag = 'div', state = 'default', className = '', children, ...rest }) {
  const classes = ['mb-card', state !== 'default' && `mb-card--${state}`, className].filter(Boolean).join(' ');
  return (
    <Tag className={classes} {...rest}>
      {children}
    </Tag>
  );
}
