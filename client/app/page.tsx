import FileUploadComponent from "./components/file-upload";
import ChatComponent from "./components/chat";

export default function Home() {
  return (
    <main className="mx-auto min-h-[calc(100vh-5rem)] w-full max-w-7xl px-4 py-6 md:px-6 md:py-8">
      <div className="grid min-h-[calc(100vh-9rem)] grid-cols-1 gap-4 md:grid-cols-12">
        <aside className="md:col-span-4 lg:col-span-3">
          <FileUploadComponent />
        </aside>
        <section className="md:col-span-8 lg:col-span-9">
          <ChatComponent />
        </section>
      </div>
    </main>
  );
}
