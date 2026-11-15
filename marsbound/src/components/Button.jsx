import Icon from './Icon.jsx';

// variant: 'default' (raised bevel) or 'primary' (filled teal, the one main action).
export default function Button({
  variant = 'default',
  icon,
  pressed = false,
  type = 'button',
  className = '',
  children,
  ...rest
}) {
  const classes = ['mb-btn', variant === 'primary' && 'mb-btn--primary', pressed && 'is-pressed', className]
    .filter(Boolean)
    .join(' ');

  return (
    <button type={type} className={classes} {...rest}>
      <span className="mb-btn__label">
        {icon && <Icon name={icon} />}
        {children}
      </span>
    </button>
  );
}
