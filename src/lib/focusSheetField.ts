export function blurSheetField() {
  const ae = document.activeElement;
  if (ae instanceof HTMLElement) ae.blur();
}
