/**
 * Contract Creation Form
 * Dropdown-driven form for creating contracts
 * Either Brand or Creator can initiate
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

type InitiatorType = 'BRAND' | 'CREATOR';
type ContractType = 'STANDARD' | 'EXCLUSIVE' | 'USAGE_RIGHTS' | 'NDA';
type Country = 'IN' | 'US' | 'EU';
type PaymentTerms = 'ON_COMPLETION' | 'WITHIN_7_DAYS' | 'WITHIN_14_DAYS' | 'ADVANCE_50';

interface FormData {
  // Who is creating?
  initiatorType: InitiatorType;
  initiatorId: string;
  
  // Other party
  counterpartyEmail: string;
  counterpartyName: string;
  
  // Contract details
  contractType: ContractType;
  country: Country;
  
  // Timeline
  startDate: string;
  endDate: string;
  
  // Compensation
  amount: number;
  currency: string;
  paymentTerms: PaymentTerms;
  
  // Deliverables
  posts: number;
  stories: number;
  reels: number;
  videos: number;
  
  // Platforms
  platforms: string[];
  
  // Template
  templateId?: string;
  message?: string;
}

const COUNTRIES: { value: Country; label: string }[] = [
  { value: 'IN', label: 'India (FTC/ASCI Guidelines)' },
  { value: 'US', label: 'United States (FTC Guidelines)' },
  { value: 'EU', label: 'European Union (GDPR)' },
];

const CONTRACT_TYPES: { value: ContractType; label: string }[] = [
  { value: 'STANDARD', label: 'Standard Creator Agreement' },
  { value: 'EXCLUSIVE', label: 'Exclusive Partnership' },
  { value: 'USAGE_RIGHTS', label: 'Content Licensing Only' },
  { value: 'NDA', label: 'Non-Disclosure Agreement' },
];

const PAYMENT_TERMS: { value: PaymentTerms; label: string }[] = [
  { value: 'ON_COMPLETION', label: 'On Completion' },
  { value: 'WITHIN_7_DAYS', label: 'Within 7 Days' },
  { value: 'WITHIN_14_DAYS', label: 'Within 14 Days' },
  { value: 'ADVANCE_50', label: '50% Advance + 50% on Completion' },
];

const PLATFORMS = [
  { value: 'YOUTUBE', label: 'YouTube' },
  { value: 'INSTAGRAM', label: 'Instagram' },
  { value: 'LINKEDIN', label: 'LinkedIn' },
  { value: 'TIKTOK', label: 'TikTok' },
  { value: 'TWITTER', label: 'Twitter/X' },
];

export default function ContractCreationForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    initiatorType: 'BRAND',
    initiatorId: '',
    counterpartyEmail: '',
    counterpartyName: '',
    contractType: 'STANDARD',
    country: 'IN',
    startDate: '',
    endDate: '',
    amount: 0,
    currency: 'INR',
    paymentTerms: 'WITHIN_7_DAYS',
    posts: 0,
    stories: 0,
    reels: 0,
    videos: 0,
    platforms: [],
    message: '',
  });

  const handleInputChange = (
    field: keyof FormData,
    value: string | number | string[]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handlePlatformToggle = (platform: string) => {
    setFormData((prev) => {
      const platforms = prev.platforms.includes(platform)
        ? prev.platforms.filter((p) => p !== platform)
        : [...prev.platforms, platform];
      return { ...prev, platforms };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/contracts/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          deliverables: {
            posts: formData.posts,
            stories: formData.stories,
            reels: formData.reels,
            videos: formData.videos,
          },
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create contract');
      }

      setSuccess(true);
      setTimeout(() => {
        router.push('/contracts');
      }, 2000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
          <div className="text-green-600 text-4xl mb-4">✓</div>
          <h2 className="text-xl font-semibold text-green-900 mb-2">
            Contract Created Successfully!
          </h2>
          <p className="text-green-700">
            The contract has been sent via OpenSign. Redirecting to contracts page...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Create New Contract
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Step 1: Who are you? */}
        <div className="bg-white rounded-lg border p-6">
          <h2 className="text-lg font-semibold mb-4">1. Contract Initiator</h2>
          
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => handleInputChange('initiatorType', 'BRAND')}
              className={`p-4 border rounded-lg text-center transition-colors ${
                formData.initiatorType === 'BRAND'
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <div className="font-semibold">Brand</div>
              <div className="text-sm text-gray-500">I'm a brand</div>
            </button>
            
            <button
              type="button"
              onClick={() => handleInputChange('initiatorType', 'CREATOR')}
              className={`p-4 border rounded-lg text-center transition-colors ${
                formData.initiatorType === 'CREATOR'
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <div className="font-semibold">Creator</div>
              <div className="text-sm text-gray-500">I'm a creator</div>
            </button>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Your User ID
            </label>
            <input
              type="text"
              value={formData.initiatorId}
              onChange={(e) => handleInputChange('initiatorId', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="user_123..."
              required
            />
          </div>
        </div>

        {/* Step 2: Other Party */}
        <div className="bg-white rounded-lg border p-6">
          <h2 className="text-lg font-semibold mb-4">
           2. {formData.initiatorType === 'BRAND' ? 'Creator' : 'Brand'} Details
          </h2>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={formData.counterpartyEmail}
                onChange={(e) => handleInputChange('counterpartyEmail', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="user@example.com"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name / Company
              </label>
              <input
                type="text"
                value={formData.counterpartyName}
                onChange={(e) => handleInputChange('counterpartyName', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder={formData.initiatorType === 'BRAND' ? 'Creator Name' : 'Company Name'}
                required
              />
            </div>
          </div>
        </div>

        {/* Step 3: Contract Type & Country */}
        <div className="bg-white rounded-lg border p-6">
          <h2 className="text-lg font-semibold mb-4">3. Contract Details</h2>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contract Type
              </label>
              <select
                value={formData.contractType}
                onChange={(e) => handleInputChange('contractType', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                {CONTRACT_TYPES.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Governing Law (Country)
              </label>
              <select
                value={formData.country}
                onChange={(e) => handleInputChange('country', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                {COUNTRIES.map((country) => (
                  <option key={country.value} value={country.value}>
                    {country.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Step 4: Timeline */}
        <div className="bg-white rounded-lg border p-6">
          <h2 className="text-lg font-semibold mb-4">4. Timeline</h2>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Date
              </label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => handleInputChange('startDate', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Date
              </label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => handleInputChange('endDate', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
          </div>
        </div>

        {/* Step 5: Compensation */}
        <div className="bg-white rounded-lg border p-6">
          <h2 className="text-lg font-semibold mb-4">5. Compensation</h2>
          
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Amount
              </label>
              <input
                type="number"
                value={formData.amount || ''}
                onChange={(e) => handleInputChange('amount', Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="25000"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Currency
              </label>
              <select
                value={formData.currency}
                onChange={(e) => handleInputChange('currency', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="INR">INR (₹)</option>
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Payment Terms
              </label>
              <select
                value={formData.paymentTerms}
                onChange={(e) => handleInputChange('paymentTerms', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                {PAYMENT_TERMS.map((term) => (
                  <option key={term.value} value={term.value}>
                    {term.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Step 6: Deliverables */}
        <div className="bg-white rounded-lg border p-6">
          <h2 className="text-lg font-semibold mb-4">6. Deliverables</h2>
          
          <div className="grid grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Posts
              </label>
              <input
                type="number"
                min="0"
                value={formData.posts || ''}
                onChange={(e) => handleInputChange('posts', Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Stories
              </label>
              <input
                type="number"
                min="0"
                value={formData.stories || ''}
                onChange={(e) => handleInputChange('stories', Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Reels/Videos
              </label>
              <input
                type="number"
                min="0"
                value={formData.reels || ''}
                onChange={(e) => handleInputChange('reels', Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Long Videos
              </label>
              <input
                type="number"
                min="0"
                value={formData.videos || ''}
                onChange={(e) => handleInputChange('videos', Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>

          {/* Platforms */}
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Platforms
            </label>
            <div className="flex flex-wrap gap-2">
              {PLATFORMS.map((platform) => (
                <button
                  key={platform.value}
                  type="button"
                  onClick={() => handlePlatformToggle(platform.value)}
                  className={`px-4 py-2 border rounded-md text-sm transition-colors ${
                    formData.platforms.includes(platform.value)
                      ? 'bg-blue-500 text-white border-blue-500'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                  }`}
                >
                  {platform.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Step 7: Message (Optional) */}
        <div className="bg-white rounded-lg border p-6">
          <h2 className="text-lg font-semibold mb-4">7. Message (Optional)</h2>
          <textarea
            value={formData.message}
            onChange={(e) => handleInputChange('message', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            rows={3}
            placeholder="Add any additional notes or context..."
          />
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
            {error}
          </div>
        )}

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Creating Contract...' : 'Create & Send Contract via OpenSign'}
          </button>
        </div>
      </form>
    </div>
  );
}
