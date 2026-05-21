type LoadingStateProps = {
  message?: string;
};

export function LoadingState({ message = 'Loading...' }: LoadingStateProps) {
  return (
    <div className="loading-state" role="status">
      <p>{message}</p>
    </div>
  );
}
