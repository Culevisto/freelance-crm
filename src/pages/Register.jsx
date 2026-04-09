import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const { register, login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    try {
      register(email, password, fullName);
      await login(email, password);
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Create Account</h2>
        
        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Full Name</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              style={styles.input}
              placeholder="John Doe"
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={styles.input}
              placeholder="your@email.com"
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={styles.input}
              placeholder="••••••••"
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              style={styles.input}
              placeholder="••••••••"
            />
          </div>

          <button type="submit" disabled={loading} style={styles.button}>
            {loading ? "Creating Account..." : "Register"}
          </button>
        </form>

        <div style={styles.footer}>
          Already have an account? <Link to="/login" style={styles.link}>Login here</Link>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "calc(100vh - 58px)",
    padding: "28px",
    background: "linear-gradient(135deg, #0f1217 0%, #13161e 100%)",
  },
  card: {
    background: "#13161e",
    border: "1px solid #242836",
    borderRadius: "12px",
    padding: "48px 40px",
    maxWidth: "400px",
    width: "100%",
  },
  title: {
    fontSize: "28px",
    fontWeight: "600",
    marginBottom: "32px",
    color: "#fff",
    textAlign: "center",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  formGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  label: {
    fontSize: "13px",
    fontWeight: "500",
    color: "#8891a8",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  },
  input: {
    padding: "10px 12px",
    border: "1px solid #242836",
    borderRadius: "6px",
    background: "#0f1217",
    color: "#fff",
    fontSize: "14px",
    fontFamily: "inherit",
    outline: "none",
    transition: "all 0.2s",
  },
  button: {
    padding: "10px 16px",
    background: "#4f8ef7",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    marginTop: "8px",
    transition: "all 0.2s",
  },
  error: {
    padding: "12px 16px",
    background: "rgba(239, 68, 68, 0.1)",
    border: "1px solid #ef4444",
    borderRadius: "6px",
    color: "#fca5a5",
    fontSize: "13px",
    marginBottom: "16px",
  },
  footer: {
    textAlign: "center",
    marginTop: "24px",
    fontSize: "13px",
    color: "#8891a8",
  },
  link: {
    color: "#4f8ef7",
    textDecoration: "none",
    fontWeight: "600",
  },
};
