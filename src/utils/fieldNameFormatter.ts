export function formatFieldName(fieldName: string) {
  return fieldName
    .split('_')
    .map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    )
    .join(' '); 
}