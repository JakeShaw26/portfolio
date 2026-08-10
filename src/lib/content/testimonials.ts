export type Testimonial = {
  /** Sort key only — never rendered. Also the React key, hence the uniqueness guard in the CMS layer. */
  index: string;
  quote: string;
  /**
   * Role alone, with no name and no company. Deliberate: role plus company can
   * single a person out, so neither is stored. The record of who said what
   * lives outside this repo and outside Contentful.
   */
  role: string;
};
