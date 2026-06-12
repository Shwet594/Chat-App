import Sidebar from "../components/Sidebar";
import ChatContainer from "../components/ChatContainer";
const HomePage = () => {
return (
<div className="h-screen bg-base-200">
<div className="flex items-center justify-center pt-10 px-4 h-full">
<div className="bg-base-100 rounded-lg shadow-xl w-full max-w-6xl h-
[90vh] overflow-hidden">
<div className="flex h-full">
<Sidebar />
<ChatContainer />
</div>
</div>
</div>
</div>
);
};
export default HomePage;