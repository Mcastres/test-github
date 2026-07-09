import { index } from '@react-router/dev/routes';
import { fimoRoutes } from 'fimo/react-router/routes';

// Examples of React Router route patterns:
//   index('./pages/Index.tsx'),
//   import { route } from '@react-router/dev/routes';
//   route('about', './pages/About.tsx'),
//   route('blog/:slug', './pages/BlogPost.tsx'),
//   import { layout } from '@react-router/dev/routes';
//   layout('./pages/layouts/Dashboard.tsx', [
//     index('./pages/dashboard/Overview.tsx'),
//     route('settings', './pages/dashboard/Settings.tsx'),
//   ]),

export default fimoRoutes([index('./pages/Index.tsx', { id: 'home' })]);
