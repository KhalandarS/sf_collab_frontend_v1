import SideBar from "../sidebars/SideBar";
import NavBar from "../../sections/NavBar";
import MarkdownFileRender from "../../../utils/markdownFileRender";
import Footer from "../../landing-page/Footer";



export default function DataCollection() {
  return <>
    <NavBar />
    <SideBar />
    <div className="w-full min-h-screen px-4 md:px-8 lg:px-16 py-12">
          <div className="max-w-4xl mx-auto">
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <MarkdownFileRender filePath="/docs/data_collection_and_tracking.md" />
            </div>
          </div>
        </div>

    <Footer />
  </>
}