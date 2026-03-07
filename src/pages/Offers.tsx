import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Tag, Search, Loader2, ArrowRight, Clock, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const Offers: React.FC = () => {
  const { t } = useTranslation();
  const [offers, setOffers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetch('/api/offers')
      .then(res => res.json())
      .then(data => {
        setOffers(data);
        setIsLoading(false);
      });
  }, []);

  const filteredOffers = offers.filter(offer => 
    offer.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    offer.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    offer.businessName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-indigo-600" /></div>;

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-3xl font-bold text-zinc-900">{t('offers')}</h1>
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
          <input
            type="text"
            placeholder="Search offers or companies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white border border-zinc-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredOffers.length > 0 ? filteredOffers.map((offer) => (
          <Link key={offer.offerId} to={`/offers/${offer.offerId}`} className="group bg-white p-6 rounded-3xl border border-zinc-200 border-l-4 border-l-indigo-600 space-y-4 hover:shadow-lg transition-all">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                <Tag className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-zinc-900 group-hover:text-indigo-600 transition-colors">{offer.title}</h3>
                <div className="flex items-center gap-1">
                  <p className="text-zinc-500 text-xs">{offer.businessName}</p>
                  <CheckCircle className="w-3 h-3 text-indigo-600 fill-indigo-600/10" />
                </div>
              </div>
            </div>
            <p className="text-zinc-600 text-sm line-clamp-3">{offer.description}</p>
            <div className="pt-4 border-t border-zinc-100 flex items-center justify-between text-xs font-bold text-zinc-400">
              <span className="uppercase tracking-widest flex items-center gap-1">
                <Clock className="w-3 h-3" /> Expires
              </span>
              <span className="text-indigo-600">{new Date(offer.expiryDate).toLocaleDateString()}</span>
            </div>
          </Link>
        )) : (
          <div className="col-span-full py-20 text-center space-y-4">
            <div className="w-20 h-20 bg-zinc-100 rounded-3xl flex items-center justify-center mx-auto text-zinc-400">
              <Tag className="w-10 h-10" />
            </div>
            <p className="text-zinc-500 font-bold">{t('no_offers')}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Offers;
