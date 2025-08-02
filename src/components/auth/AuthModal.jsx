import React, { useState } from 'react';
import Icon from '../AppIcon';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { useAuth } from '../../contexts/AuthContext';

const AuthModal = ({ 
  isOpen = false, 
  onClose = () => {},
  mode = 'signin', // 'signin' | 'signup'
  onModeChange = () => {}
}) => {
  const { signIn, signUp } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  if (!isOpen) return null;

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (error) setError(null);
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (mode === 'signup') {
        if (formData?.password !== formData?.confirmPassword) {
          throw new Error('Passwords do not match');
        }

        const { error } = await signUp(formData?.email, formData?.password, {
          full_name: formData?.fullName
        });

        if (error) throw error;
        
        // Show success message for signup
        setError('Account created! Please check your email to verify your account.');
      } else {
        const { error } = await signIn(formData?.email, formData?.password);
        if (error) throw error;
        onClose();
      }
    } catch (err) {
      setError(err?.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const isValidForm = () => {
    if (!formData?.email || !formData?.password) return false;
    if (mode === 'signup') {
      return formData?.fullName && formData?.confirmPassword;
    }
    return true;
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-xl p-6 w-full max-w-md shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-foreground">
              {mode === 'signin' ? 'Sign In' : 'Create Account'}
            </h2>
            <p className="text-muted-foreground text-sm">
              {mode === 'signin' ?'Welcome back to TempChat' :'Join TempChat for secure messaging'
              }
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="spring-bounce"
          >
            <Icon name="X" size={20} />
          </Button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <Input
              label="Full Name"
              type="text"
              value={formData?.fullName}
              onChange={(value) => handleInputChange('fullName', value)}
              placeholder="Enter your full name"
              required
              disabled={loading}
            />
          )}

          <Input
            label="Email"
            type="email"
            value={formData?.email}
            onChange={(value) => handleInputChange('email', value)}
            placeholder="Enter your email"
            required
            disabled={loading}
          />

          <div className="relative">
            <Input
              label="Password"
              type={showPassword ? "text" : "password"}
              value={formData?.password}
              onChange={(value) => handleInputChange('password', value)}
              placeholder="Enter your password"
              required
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-8 p-1 hover:bg-muted rounded-md transition-colors"
              disabled={loading}
            >
              <Icon 
                name={showPassword ? "EyeOff" : "Eye"} 
                size={18} 
                className="text-muted-foreground"
              />
            </button>
          </div>

          {mode === 'signup' && (
            <Input
              label="Confirm Password"
              type="password"
              value={formData?.confirmPassword}
              onChange={(value) => handleInputChange('confirmPassword', value)}
              placeholder="Confirm your password"
              required
              disabled={loading}
            />
          )}

          {/* Error Message */}
          {error && (
            <div className={`flex items-center space-x-2 p-3 rounded-lg ${
              error?.includes('check your email') 
                ? 'bg-success/10 border border-success/20' :'bg-error/10 border border-error/20'
            }`}>
              <Icon 
                name={error?.includes('check your email') ? "CheckCircle" : "AlertTriangle"} 
                size={16} 
                className={error?.includes('check your email') ? "text-success" : "text-error"}
              />
              <span className={`text-sm ${
                error?.includes('check your email') ? 'text-success' : 'text-error'
              }`}>
                {error}
              </span>
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            variant="default"
            size="lg"
            fullWidth
            disabled={!isValidForm() || loading}
            loading={loading}
            className="spring-bounce"
          >
            {loading 
              ? (mode === 'signin' ? 'Signing In...' : 'Creating Account...') 
              : (mode === 'signin' ? 'Sign In' : 'Create Account')
            }
          </Button>

          {/* Mode Switch */}
          <div className="text-center pt-4 border-t border-border">
            <p className="text-muted-foreground text-sm">
              {mode === 'signin' ? "Don't have an account? " :"Already have an account? "
              }
              <button
                type="button"
                onClick={() => onModeChange(mode === 'signin' ? 'signup' : 'signin')}
                className="text-primary hover:text-primary/80 font-medium"
                disabled={loading}
              >
                {mode === 'signin' ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          </div>
        </form>

        {/* Demo Credentials */}
        <div className="mt-6 p-3 bg-muted/30 rounded-lg">
          <p className="text-xs font-medium text-muted-foreground mb-2">Demo Credentials:</p>
          <div className="space-y-1 text-xs text-muted-foreground">
            <p>Email: admin@tempchat.app</p>
            <p>Password: TempChat2025!</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;