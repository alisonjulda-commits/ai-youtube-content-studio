import React from 'react';
import { interpolate, Easing } from 'remotion';
import { COLORS } from '../../types';

interface ChecklistItem {
  label: string;
  checked: boolean;
}

interface ChecklistProps {
  items: ChecklistItem[];
  style?: React.CSSProperties;
}

export const Checklist: React.FC<ChecklistProps> = ({ items, style = {} }) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        ...style,
      }}
    >
      {items.map((item, index) => (
        <ChecklistItem
          key={index}
          item={item}
          index={index}
          totalItems={items.length}
        />
      ))}
    </div>
  );
};

interface ChecklistItemProps {
  item: ChecklistItem;
  index: number;
  totalItems: number;
}

const ChecklistItem: React.FC<ChecklistItemProps> = ({ item }) => {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        fontSize: 18,
        fontWeight: 500,
        color: COLORS.darkSlate,
        fontFamily: '"Lato", sans-serif',
      }}
    >
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: '50%',
          backgroundColor: item.checked ? COLORS.teal : 'transparent',
          border: `2px solid ${COLORS.teal}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 20,
        }}
      >
        {item.checked && '✓'}
      </div>
      <span>{item.label}</span>
    </div>
  );
};
