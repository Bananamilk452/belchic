export function GlobalFooter() {
  return (
    <div className="flex w-full flex-col items-center justify-center border-t border-border bg-white">
      <div className="flex w-full max-w-5xl flex-col items-start justify-center gap-5 p-10 md:items-center">
        <span className="text-lg">빠른 링크</span>
        <div className="flex flex-col flex-wrap items-start gap-5 underline-offset-3 *:text-sm *:text-muted-foreground *:hover:text-black *:hover:underline md:flex-row md:items-center">
          <span>이용약관</span>
          <span>환불정책</span>
          <span>개인 정보 정책</span>
          <span>특정 상거래법에 따른 표기</span>
        </div>
      </div>
      <div className="w-full border-b border-border" />
      <div className="flex w-full max-w-7xl flex-col items-center justify-center gap-5 p-10">
        <div className="flex w-full flex-wrap items-center justify-center md:justify-start">
          <span className="text-xs font-light text-muted-foreground">© 2026, Belchic</span>
          <div className="flex flex-wrap items-center justify-center underline-offset-3 *:text-xs *:font-light *:text-muted-foreground *:before:px-2 *:before:content-['\b7'] *:hover:text-black *:hover:underline">
            <span>환불 정책</span>
            <span>개인정보처리방침</span>
            <span>서비스 약관</span>
            <span>배송 정책</span>
            <span>법적 고지 사항</span>
          </div>
        </div>
      </div>
    </div>
  );
}
