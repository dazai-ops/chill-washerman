export const countPriceService = (
  beratKg: number, 
  jumlahItem: number, 
  hargaKg: number, 
  hargaItem: number, 
  acuanHarga: 'berat' | 'item', 
  layananSetrika: boolean
) => {
  let total = 0
  if(acuanHarga === 'berat'){
    total = beratKg * hargaKg
  } else if(acuanHarga === 'item'){
    total = jumlahItem * hargaItem
  }

  if(layananSetrika) {
    total += total * 0.1
  }

  return total

}

export const countKembalian = (total: number, dibayarkan: number) => {
  return dibayarkan - total
}