function Terminal() {
  return (
    <div className="terminal-component">

      <div className="terminal-header">

        <div className="terminal-dots">
          <span></span>
          <span></span>
          <span></span>
        </div>

        <span>terminal</span>

      </div>

      <div className="terminal-body">

        <p>
          <span className="terminal-green">
            $
          </span>{" "}
          npm run developer
        </p>

        <p className="terminal-output">
          Starting developer mode...
        </p>

        <p className="terminal-output">
          Loading Java...
        </p>

        <p className="terminal-output">
          Loading Spring Boot...
        </p>

        <p className="terminal-output">
          Loading React...
        </p>

        <p className="terminal-success">
          ✓ Developer ready.
        </p>

      </div>

    </div>
  );
}

export default Terminal;