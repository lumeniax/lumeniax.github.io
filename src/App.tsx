import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Layout } from "@/components/Layout";

import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Studio from "@/pages/Studio";
import StudioServices from "@/pages/StudioServices";
import StudioPortfolio from "@/pages/StudioPortfolio";
import StudioProcess from "@/pages/StudioProcess";
import StudioContact from "@/pages/StudioContact";
import Academy from "@/pages/Academy";
import AcademyArticles from "@/pages/AcademyArticles";
import ArticleDetail from "@/pages/ArticleDetail";
import AcademyFormations from "@/pages/AcademyFormations";
import FormationDetail from "@/pages/FormationDetail";
import AcademyVideos from "@/pages/AcademyVideos";
import AcademyCommunaute from "@/pages/AcademyCommunaute";
import ForumSpace from "@/pages/ForumSpace";
import ForumPost from "@/pages/ForumPost";
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import MentionsLegales from "@/pages/MentionsLegales";
import PolitiqueConfidentialite from "@/pages/PolitiqueConfidentialite";

const queryClient = new QueryClient();

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Home} />

        {/* Studio */}
        <Route path="/studio" component={Studio} />
        <Route path="/studio/services" component={StudioServices} />
        <Route path="/studio/portfolio" component={StudioPortfolio} />
        <Route path="/studio/process" component={StudioProcess} />
        <Route path="/studio/contact" component={StudioContact} />

        {/* Academy */}
        <Route path="/academy" component={Academy} />
        <Route path="/academy/articles" component={AcademyArticles} />
        <Route path="/academy/articles/:slug" component={ArticleDetail} />
        <Route path="/academy/formations" component={AcademyFormations} />
        <Route path="/academy/formations/:slug" component={FormationDetail} />
        <Route path="/academy/videos" component={AcademyVideos} />

        {/* Community Forum */}
        <Route path="/academy/communaute" component={AcademyCommunaute} />
        <Route path="/academy/communaute/:spaceId" component={ForumSpace} />
        <Route path="/academy/communaute/:spaceId/:postId" component={ForumPost} />

        <Route path="/about" component={About} />
        <Route path="/contact" component={Contact} />

        {/* Legal */}
        <Route path="/mentions-legales" component={MentionsLegales} />
        <Route path="/politique-confidentialite" component={PolitiqueConfidentialite} />

        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
