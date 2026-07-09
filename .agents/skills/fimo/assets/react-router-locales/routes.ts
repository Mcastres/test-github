import type { RouteConfig } from '@react-router/dev/routes';
import { index, route } from '@react-router/dev/routes';
import { fimoRoutes } from 'fimo/react-router/routes';

const routes = [
  index('./pages/Index.tsx', { id: 'home' }),
  route('pricing', './pages/Pricing.tsx', { id: 'pricing' }),
  route('blog/:slug', './pages/BlogPost.tsx', { id: 'blog-post' }),
] satisfies RouteConfig;

export default fimoRoutes(routes) satisfies RouteConfig;
