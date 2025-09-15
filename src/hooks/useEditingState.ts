import { useState, useCallback } from 'react';
import Konva from 'konva';
import { NotecardData, StackData } from '../types';

interface EditingState {
  editingCardId: string | null;
  editingField: 'title' | 'content' | 'date' | 'key' | 'tags' | 'stack-title' | null;
  editingKonvaNode: Konva.Node | null;
  editingTextValue: string;
  editingStackId: string | null;
  editingConnectionId: string | null;
}

export const useEditingState = (
  stacks: StackData[],
  onUpdateCard: (cardId: string, updates: Partial<NotecardData>) => void,
  onUpdateStack: (stackId: string, updates: Partial<StackData>) => void,
  onUpdateConnection: (connectionId: string, label: string) => void
) => {
  const [editingCardId, setEditingCardId] = useState<string | null>(null);
  const [editingField, setEditingField] = useState<'title' | 'content' | 'date' | 'key' | 'tags' | 'stack-title' | null>(null);
  const [editingKonvaNode, setEditingKonvaNode] = useState<Konva.Node | null>(null);
  const [editingTextValue, setEditingTextValue] = useState<string>('');
  const [editingStackId, setEditingStackId] = useState<string | null>(null);
  const [editingConnectionId, setEditingConnectionId] = useState<string | null>(null);

  const handleEditStart = useCallback((cardId: string, field: 'title' | 'content' | 'date' | 'key' | 'tags', konvaNode: Konva.Node) => {
    console.log('handleEditStart received field:', field);
    setEditingCardId(cardId);
    setEditingField(field);
    setEditingKonvaNode(konvaNode);

    const card = stacks.flatMap(s => s.cards).find(c => c.id === cardId);
    if (card) {
      let value = '';
      switch (field) {
        case 'title':
          value = card.title;
          break;
        case 'content':
          value = card.content;
          break;
        case 'date':
          value = card.date ? new Date(card.date).toISOString().split('T')[0] : '';
          break;
        case 'key':
          value = card.key || '';
          break;
        case 'tags':
          value = card.tags ? card.tags.join(', ') : '';
          break;
        default:
          value = '';
      }
      setEditingTextValue(value);
    }
  }, [stacks]);

  const handleStackTitleEditStart = useCallback((stackId: string, konvaNode: Konva.Node) => {
    console.log('handleStackTitleEditStart called for stack:', stackId);
    setEditingStackId(stackId);
    setEditingField('stack-title');
    setEditingKonvaNode(konvaNode);

    const stack = stacks.find(s => s.id === stackId);
    if (stack) {
      setEditingTextValue(stack.title || '');
    }
  }, [stacks]);

  const handleConnectionLabelEdit = useCallback((connectionId: string, konvaNode: Konva.Node, currentLabel?: string) => {
    setEditingConnectionId(connectionId);
    setEditingTextValue(currentLabel || '');
    setEditingKonvaNode(konvaNode);
  }, []);

  const handleEditBlur = useCallback(() => {
    if (editingCardId && editingField) {
      const currentCard = stacks.flatMap(s => s.cards).find(c => c.id === editingCardId);
      if (currentCard) {
        const newValue = editingTextValue.trim();
        let updates: Partial<NotecardData> = {};
        let hasChanged = false;

        switch (editingField) {
          case 'title':
            if (newValue !== currentCard.title) {
              updates.title = newValue;
              hasChanged = true;
            }
            break;
          case 'content':
            if (newValue !== currentCard.content) {
              updates.content = newValue;
              hasChanged = true;
            }
            break;
          case 'date':
            const newDate = newValue ? new Date(newValue).toISOString() : new Date().toISOString();
            if (newDate !== currentCard.date) {
              updates.date = newDate;
              hasChanged = true;
            }
            break;
          case 'key':
            if (newValue !== (currentCard.key || '')) {
              updates.key = newValue || undefined;
              hasChanged = true;
            }
            break;
          case 'tags':
            const newTags = newValue ? newValue.split(',').map(tag => tag.trim()).filter(Boolean) : undefined;
            const currentTags = currentCard.tags || [];
            const tagsChanged = JSON.stringify(newTags || []) !== JSON.stringify(currentTags);
            if (tagsChanged) {
              updates.tags = newTags;
              hasChanged = true;
            }
            break;
        }

        if (hasChanged) {
          onUpdateCard(editingCardId, updates);
        }
      }
    } else if (editingConnectionId) {
      onUpdateConnection(editingConnectionId, editingTextValue);
    } else if (editingStackId && editingField === 'stack-title') {
      const currentStack = stacks.find(s => s.id === editingStackId);
      if (currentStack && editingTextValue !== (currentStack.title || '')) {
        onUpdateStack(editingStackId, { title: editingTextValue });
      }
    }
    
    // Clear all editing state
    setEditingCardId(null);
    setEditingField(null);
    setEditingStackId(null);
    setEditingConnectionId(null);
    setEditingKonvaNode(null);
    setEditingTextValue('');
  }, [editingCardId, editingField, editingStackId, editingConnectionId, editingTextValue, stacks, onUpdateCard, onUpdateStack, onUpdateConnection]);

  const clearEditingState = useCallback(() => {
    setEditingCardId(null);
    setEditingField(null);
    setEditingStackId(null);
    setEditingConnectionId(null);
    setEditingKonvaNode(null);
    setEditingTextValue('');
  }, []);

  return {
    // State
    editingCardId,
    editingField,
    editingKonvaNode,
    editingTextValue,
    editingStackId,
    editingConnectionId,
    
    // Actions
    setEditingTextValue,
    handleEditStart,
    handleStackTitleEditStart,
    handleConnectionLabelEdit,
    handleEditBlur,
    clearEditingState,
    
    // For external components that need to trigger editing
    setEditingCardId,
    setEditingField,
    setEditingKonvaNode,
  };
};