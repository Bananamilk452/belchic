export default function NotFound() {
  return (
    <div className="flex w-full flex-col items-center py-20">
      <h1 className="text-2xl font-bold">존재하지 않는 컬렉션입니다</h1>
      <p className="mt-4 text-gray-500">요청하신 컬렉션을 찾을 수 없습니다.</p>
    </div>
  );
}
