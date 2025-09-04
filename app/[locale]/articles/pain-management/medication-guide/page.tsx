import { redirect } from 'next/navigation';

export default function RedirectPage() {
  redirect('/downloads/medication-guide', 'replace');
}