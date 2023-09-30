import { Footer, Header } from './components';
import { AllRoutes } from './routes/AllRoutes';

function App() {

  return (
    <div className="App">
      <Header></Header>
      <main>
        <AllRoutes/>
      </main>
      <Footer></Footer>
    </div>
  );
}

export default App;
