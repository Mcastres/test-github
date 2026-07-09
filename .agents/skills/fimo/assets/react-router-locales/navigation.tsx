import { FimoLink } from 'fimo/react-router';

export function Navigation() {
  return (
    <nav>
      <FimoLink to="/">Home</FimoLink>
      <FimoLink to="/pricing">Pricing</FimoLink>
      <FimoLink to="/pricing" locale="es">
        Pricing in Spanish
      </FimoLink>
    </nav>
  );
}
