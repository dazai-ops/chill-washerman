import { Text, TextField } from '@radix-ui/themes';
import { useEffect, useState } from "react"

interface Props{
  value?: string,
  onChange?: (value:string) => void
  name: string
  className?: string
  size?: "1" | "2" | "3"
  labelSize?: "1" | "2"
  labelColor?: "red" | "green" | "yellow" | "blue" | "gray"
  label: string
  style?: React.CSSProperties

}

const RupiahInput = ({value, onChange, name, className, size ="2", label = "harga", style, labelSize = "1", labelColor}: Props) => {
  const [displayValue, setDisplayValue] = useState("")

  useEffect(() => {
    if(value !== undefined) {
      setDisplayValue(formatRupiah(value.toString()))
    }
  }, [value])

  const formatRupiah = (val:string) => {
    if(!val) return ""
    const numberString = val.replace(/[^,\d]/g, "")
    const numberValue = parseInt(numberString || "0", 10)
    return (
      "Rp " +
      numberValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
    )
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const raw = event.target.value.replace(/[^,\d]/g, "")
    setDisplayValue(formatRupiah(raw))
    if(onChange) onChange(raw)
  }
  
  return (
    <>
      <Text size={labelSize} weight="bold" color={labelColor}>{label}</Text>
      <TextField.Root
        style={style}
        size={size}
        name={name}
        className={className}
        value={displayValue}
        onChange={handleChange}
        placeholder='Rp 0'
      />
    </>
  )
}

export default RupiahInput