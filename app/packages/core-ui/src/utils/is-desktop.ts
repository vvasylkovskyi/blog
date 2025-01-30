import useIsSsr from "../hooks/is-ssr";

export function isDesktop(): boolean | null {
  const isSsr = useIsSsr();

  if (isSsr) {
    return null;
  }

  return window.innerWidth >= 992;
}
