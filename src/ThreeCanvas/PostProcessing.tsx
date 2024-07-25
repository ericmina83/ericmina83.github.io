import { EffectComposer, N8AO } from "@react-three/postprocessing";

export const PostProcessing: React.FC = () => {
  return (
    <EffectComposer enableNormalPass={false}>
      <N8AO />
    </EffectComposer>
  )
}