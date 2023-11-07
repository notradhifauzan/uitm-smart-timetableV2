import { Footer, Header } from './components';
import { AllRoutes } from './routes/AllRoutes';

function App() {

  return (
    <>
      <Header></Header>
      <div className="App container">
        <main>
          <AllRoutes />
        </main>
      </div>
      <Footer></Footer>
    </>
  );
}

export default App;
