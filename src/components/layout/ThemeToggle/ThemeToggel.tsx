import React from 'react'
import {Switch} from 'radix-ui'

interface Props {
  appearance: string,
  setAppearance: React.Dispatch<React.SetStateAction<string>>
}

function ThemeToggel({appearance, setAppearance}: Props) {
  return (
		<div className="fixed top-0 left-0 m-4 flex items-center gap-2">
      <Switch.Root
        id="theme-switch"
        checked={appearance === "dark"}
        onCheckedChange={(checked) =>
          setAppearance(checked ? "dark" : "light")
        }
        className="
          w-[42px] h-[25px] rounded-full relative 
          bg-black/30 shadow-md 
          focus:outline-none focus:ring-2 focus:ring-black
          data-[state=checked]:bg-indigo-500
        "
      >
        <Switch.Thumb
          className="
            block w-[21px] h-[21px] bg-white rounded-full shadow-sm 
            transition-transform duration-100 
            translate-x-[2px] 
            data-[state=checked]:translate-x-[19px]
          "
        />
      </Switch.Root>
    </div>
  )
}

export default ThemeToggel
