import React from "react";

type Props = { children: React.ReactNode; fallback?: React.ReactNode };
type State = { hasError: boolean; error?: Error };

export default class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  reset = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-6">
          <div className="bg-white rounded-2xl shadow p-6 max-w-md text-center">
            <h3 className="text-lg font-semibold mb-2">Something went wrong</h3>
            <p className="text-sm text-gray-500 mb-4">
              {this.state.error?.message || "An unexpected error occurred."}
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={this.reset}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md"
              >
                Try again
              </button>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 border rounded-md"
              >
                Reload page
              </button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
