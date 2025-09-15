import { NotecardData, ConnectionData, WorkspaceData, CARD_COLORS } from '../types';

// Data migration utility for backward compatibility
export const migrateWorkspaceData = (data: any): WorkspaceData => {
  // Migrate NotecardData fields
  const migrateCard = (card: any): NotecardData => ({
    ...card,
    date: card.date || new Date().toISOString(), // Default to current date if missing
    backgroundColor: card.backgroundColor || CARD_COLORS.DEFAULT,
    tags: card.tags || [],
    key: card.key || undefined,
  });

  // Migrate ConnectionData fields  
  const migrateConnection = (connection: any): ConnectionData => ({
    ...connection,
    label: connection.label || undefined,
  });

  return {
    ...data,
    stacks: data.stacks?.map((stack: any) => ({
      ...stack,
      cards: stack.cards?.map(migrateCard) || [],
    })) || [],
    connections: data.connections?.map(migrateConnection) || [],
  };
};