import './globals.css';
import WaterInteraction from '../components/WaterInteraction';

export const metadata = {
  title: 'Aqua Haul — Mobile Car Wash in Kottayam',
  description: 'Mobile car wash across Kottayam district. Foam wash, steam wash, detailing and heavy-vehicle cleaning — we bring our own water and power, right to your driveway.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}<WaterInteraction /></body>
    </html>
  );
}
