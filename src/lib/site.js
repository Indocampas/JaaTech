/* Single source of truth for JAA TECH contact details.
   Change the email here and every form/link on the site follows. */
export const SITE = {
  name: 'JAA TECH PRIVATE LIMITED',
  phoneDisplay: '+91 90876 12310',
  phoneTel: '+919087612310',
  whatsappNumber: '919087612310', // country code + number, digits only
  email: 'jaatechnology25@gmail.com',
  businessEmail: 'Business@jaatech.in',
  addressLines: [
    'No: 3, 1st Floor, Tidel Neo,',
    'Tiruchitrambalam Village, Vanur Taluk,',
    'Villupuram - 605 111, Tamilnadu.',
  ],
  instagram: 'https://www.instagram.com/jaa_tech?stkn=MWplN2tnMm5lemc1eg==',
  linkedin: 'https://www.linkedin.com/in/jaa-tech',
}
SITE.whatsappLink = `https://wa.me/${SITE.whatsappNumber}`
SITE.mapLink = 'https://www.google.com/maps/search/?api=1&query=' +
  encodeURIComponent('Tidel Neo, Tiruchitrambalam, Vanur, Villupuram 605111')
