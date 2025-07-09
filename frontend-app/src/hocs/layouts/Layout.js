import { connect } from "react-redux";

function Layout({ children }) {
  return (
    <div className="layout-container">
      {/* Puedes agregar aquí elementos comunes como header, sidebar, etc. */}
      {children}
    </div>
  );
}

// Si no necesitas mapear estado, deja un objeto vacío
const mapStateToProps = (state) => ({});

// Si no necesitas acciones, deja un objeto vacío
const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(Layout);