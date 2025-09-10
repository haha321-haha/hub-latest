export default function TestPage() {
  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>测试页面</h1>
      <p>如果你看到这个页面，说明部署成功了！</p>
      <p>时间: {new Date().toLocaleString()}</p>
    </div>
  );
}
