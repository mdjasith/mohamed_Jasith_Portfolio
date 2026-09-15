import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginAdmin } from "../services/authService";

function AdminLogin() {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {

    event.preventDefault();

    setError("");
    setLoading(true);

    try {

      await loginAdmin(email, password);

      navigate("/admin/dashboard");

    } catch (error) {

      console.error(error);

      setError(
        "Authentication failed. Check your email and password."
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-page">

      <div className="admin-grid"></div>

      <div className="admin-login-container">

        <a href="/" className="admin-back">
          ← RETURN TO PORTFOLIO
        </a>

        <div className="admin-login-card">

          <div className="admin-logo">
            MJ
          </div>

          <div className="admin-label">
            ADMIN ACCESS
          </div>

          <h1>
            SYSTEM LOGIN
          </h1>

          <p>
            Authenticate to access portfolio management.
          </p>

          <form onSubmit={handleSubmit}>

            <div className="form-group">

              <label>
                EMAIL
              </label>

              <input
                type="email"
                placeholder="admin@email.com"
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
                required
              />

            </div>

            <div className="form-group">

              <label>
                PASSWORD
              </label>

              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(event) =>
                  setPassword(event.target.value)
                }
                required
              />

            </div>

            {error && (
              <div className="login-error">
                {error}
              </div>
            )}

            <button
              className="btn btn-primary admin-login-button"
              type="submit"
              disabled={loading}
            >
              {loading
                ? "AUTHENTICATING..."
                : "AUTHENTICATE →"}
            </button>

          </form>

        </div>

        <p className="admin-warning">
          AUTHORIZED PERSONNEL ONLY
        </p>

      </div>

    </div>
  );
}

export default AdminLogin;