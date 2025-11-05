import ProfileBlockEditor from "./ProfileBlockEditor";
import HeaderBlockEditor from "./HeaderBlockEditor";
import TextBlockEditor from "./TextBlockEditor";
import LinkButtonBlockEditor from "./LinkButtonBlockEditor";
import QuoteBlockEditor from "./QuoteBlockEditor";
import GalleryBlockEditor from "./GalleryBlockEditor";
import FAQBlockEditor from "./FAQBlockEditor";
import StatsBlockEditor from "./StatsBlockEditor";
import HoursBlockEditor from "./HoursBlockEditor";
import ServicesBlockEditor from "./ServicesBlockEditor";
import PricingBlockEditor from "./PricingBlockEditor";
import ProductsBlockEditor from "./ProductsBlockEditor";
import ContactInfoBlockEditor from "./ContactInfoBlockEditor";
import LocationBlockEditor from "./LocationBlockEditor";
import ContactLocationBlockEditor from "./ContactLocationBlockEditor";
import ExperienceBlockEditor from "./ExperienceBlockEditor";
import SkillsBlockEditor from "./SkillsBlockEditor";
import YouTubeTikTokBlockEditor from "./YouTubeTikTokBlockEditor";
import SpotifyBlockEditor from "./SpotifyBlockEditor";
import CountdownBlockEditor from "./CountdownBlockEditor";
import PromptPayBlockEditor from "./PromptPayBlockEditor";
import GoogleMapsBlockEditor from "./GoogleMapsBlockEditor";
import ContactFormBlockEditor from "./ContactFormBlockEditor";
import TestimonialsBlockEditor from "./TestimonialsBlockEditor";
import TeamBlockEditor from "./TeamBlockEditor";
import TimelineBlockEditor from "./TimelineBlockEditor";

export default function BlockEditor({ type, value, onChange }) {
    switch (type) {
        case "profile":
            return <ProfileBlockEditor value={value} onChange={onChange} />;
        case "header":
            return <HeaderBlockEditor value={value} onChange={onChange} />;
        case "text":
            return <TextBlockEditor value={value} onChange={onChange} />;
        case "link":
        case "button":
            return <LinkButtonBlockEditor value={value} onChange={onChange} />;
        case "quote":
            return <QuoteBlockEditor value={value} onChange={onChange} />;
        case "gallery":
            return <GalleryBlockEditor value={value} onChange={onChange} />;
        case "faq":
            return <FAQBlockEditor value={value} onChange={onChange} />;
        case "stats":
            return <StatsBlockEditor value={value} onChange={onChange} />;
        case "hours":
            return <HoursBlockEditor value={value} onChange={onChange} />;
        case "services":
            return <ServicesBlockEditor value={value} onChange={onChange} />;
        case "pricing":
            return <PricingBlockEditor value={value} onChange={onChange} />;
        case "products":
            return <ProductsBlockEditor value={value} onChange={onChange} />;
        case "contact-info":
            return <ContactInfoBlockEditor value={value} onChange={onChange} />;
        case "location":
            return <LocationBlockEditor value={value} onChange={onChange} />;
        case "contact-location":
            return (
                <ContactLocationBlockEditor value={value} onChange={onChange} />
            );
        case "experience":
            return <ExperienceBlockEditor value={value} onChange={onChange} />;
        case "skills":
            return <SkillsBlockEditor value={value} onChange={onChange} />;
        case "youtube":
        case "tiktok":
            return (
                <YouTubeTikTokBlockEditor value={value} onChange={onChange} />
            );
        case "spotify":
            return <SpotifyBlockEditor value={value} onChange={onChange} />;
        case "countdown":
            return <CountdownBlockEditor value={value} onChange={onChange} />;
        case "promptpay":
            return <PromptPayBlockEditor value={value} onChange={onChange} />;
        case "google-maps":
            return <GoogleMapsBlockEditor value={value} onChange={onChange} />;
        case "contact-form":
            return <ContactFormBlockEditor value={value} onChange={onChange} />;
        case "testimonials":
            return (
                <TestimonialsBlockEditor value={value} onChange={onChange} />
            );
        case "team":
            return <TeamBlockEditor value={value} onChange={onChange} />;
        case "timeline":
            return <TimelineBlockEditor value={value} onChange={onChange} />;
        default:
            return null;
    }
}
