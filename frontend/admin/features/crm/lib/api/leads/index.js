/**
 * Archivo de barril (index) para APIs de CRM
 * Centraliza todas las exportaciones para facilitar la importación en componentes
 * Mantiene compatibilidad con código existente
 */

// Importar las funciones individuales
import { getLeads } from './getLeads';
import { getLeadById } from './getLeadById';
import { createLead } from './createLead';
import { updateLead } from './updateLead';
import { deleteLead } from './deleteLead';
import { getLeadEngagements } from './getLeadEngagements';
import { createEngagement } from './createEngagement';

// Mantener la estructura original para compatibilidad
export const leadsApi = {
  getLeads,
  getLeadById,
  createLead,
  updateLead,
  deleteLead
};

export const engagementsApi = {
  getLeadEngagements,
  createEngagement
};

// También exportar las funciones individuales para uso directo
export {
  getLeads,
  getLeadById,
  createLead,
  updateLead,
  deleteLead,
  getLeadEngagements,
  createEngagement
};
