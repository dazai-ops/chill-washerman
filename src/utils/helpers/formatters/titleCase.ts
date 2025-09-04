export function formatToTitleCase(input: string): string {
  return input
    .replace(/[_\-]+/g, ' ') // Ganti underscore atau dash dengan spasi
    .replace(/\s+/g, ' ')    // Normalize spasi ganda jadi satu spasi
    .trim()                  // Hapus spasi depan belakang
    .split(' ')              // Pisahkan per kata
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Kapital tiap kata
    .join(' ');
}
