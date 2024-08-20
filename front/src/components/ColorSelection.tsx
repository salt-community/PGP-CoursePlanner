import { HexColorPicker } from "react-colorful";

type Props = {
  color: string;
  setColor: React.Dispatch<React.SetStateAction<string>>
}

export default function ColorSelection({ color, setColor }: Props) {

  return (
        <HexColorPicker color={color} onChange={setColor} />
  )
};