import Error404 from 'containers/errors/Error404';
import Home from 'containers/pages/home';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'

function App() {
  return (
    <Router>
      <Routes>
          {/* Error display */}
          <Route path ="*" element={<Error404 />} />

          {/* Home display */}
          <Route path ="/" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;