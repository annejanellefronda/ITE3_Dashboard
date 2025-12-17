import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
}

export const SEO = ({
  title = 'Diabetes & Diet Dashboard | Health Data Analysis',
  description = 'Interactive dashboard analyzing the correlation between regional sugar consumption and diabetes prevalence worldwide. Explore health data trends across continents and time periods.',
  keywords = 'diabetes, sugar consumption, health dashboard, data visualization, diet correlation, obesity, health analytics',
}: SEOProps) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <link rel="canonical" href={window.location.href} />
    </Helmet>
  );
};
