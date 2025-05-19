/**
 * Archivo de barril que exporta todos los adaptadores relacionados con leads
 * Facilita las importaciones y mantiene una API limpia
 */

export { generateLeadsPDF as pdfAdapter } from './pdf-adapter';
export {
  contactHistoryAdapter,
  getContactTypeColor,
  getContactTypeIcon as contactsAdapter
} from './contacts.adapter';
export { default as leadsAdapter } from './leads.adapter';

// Adaptadores de engagements (contactos con leads)
export {
  engagementToApiAdapter,
  apiToEngagementAdapter,
  apiEngagementsListAdapter
} from './engagements.adapter';
