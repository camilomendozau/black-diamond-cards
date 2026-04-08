// analytics.js - Versión completa con múltiples trackers
import { TIMEZONE_MAP } from "../data/timezonesMap";
import {v4 as uuidv4 } from 'uuid';


class Analytics {
  constructor(endpoint) {
    this.endpoint = endpoint;
    this.pageLoadTime = Date.now();
    this.prospectId = null;
    this.sessionId = null;
    this.country = null;
    this.idRef = null;
    this.initialized = false;
  }
  
  // ← Método de inicialización que se llama solo en el cliente
  init() {
    if (typeof window === 'undefined' || this.initialized) return;
    
    this.prospectId = this.getOrCreateIdProspect();
    this.sessionId = this.getOrCreateSession();
    this.country = this.getOrLoadCountry();
    
    let params = new URLSearchParams(window.location.search);
    this.idRef = params.get('ir') ? params.get('ir') : undefined;
    if (this.idRef) {
      sessionStorage.setItem('id-ref', this.idRef);
    }
    
    this.setupListeners();
    this.initialized = true;
  }
  
  getOrLoadCountry() {
    if (typeof window === 'undefined') return null;
    
    let prospectCountry = TIMEZONE_MAP[Intl.DateTimeFormat().resolvedOptions().timeZone];
    localStorage.setItem('prospect-country', prospectCountry);
    return localStorage.getItem('prospect-country');
  }

  getOrCreateSession() {
    if (typeof window === 'undefined') return null;
    
    let sessionId = sessionStorage.getItem('analytics-session');
    if (!sessionId) {
      sessionId = `${Date.now()}-${Math.random().toString(36)}`;
      sessionStorage.setItem('analytics-session', sessionId);
    }
    return sessionId;
  }

  getOrCreateIdProspect() {
    if (typeof window === 'undefined') return null;
    
    let prospectId = localStorage.getItem('prospect-id');
    if (!prospectId) {
      prospectId = uuidv4();
      localStorage.setItem('prospect-id', prospectId);
    }
    return prospectId;
  }

  setupListeners() {
    if (typeof window === 'undefined') return;
    
    this.trackPageView();
    this.setupClickTracking();
    this.setupExitTracking();
  }
  // ============= MÉTODOS DE TRACKING =============

  // 1. Page views
  trackPageView(customData = {}) {
    this.track('page_view', {
      path: window.location.pathname,
      title: document.getElementById('title') ? document.getElementById('title').innerText : document.title,
      ...customData
    });
  }

  // 2. Clicks en botones/enlaces
  setupClickTracking() {
    document.addEventListener('click', (e) => {
      const trackElement = e.target.closest('[data-track]');
      if (trackElement) {
        this.trackClick(
          trackElement.dataset.track,
          {
            text: trackElement.textContent.trim(),
            href: trackElement.href || null,
            position: this.getElementPosition(trackElement)
          }
        );
      }
    });
  }

  trackClick(elementName, additionalData = {}) {
    this.track('click', {
      element: elementName,
      ...additionalData
    });
  }

  // 3. Formularios
  trackFormStart(formName) {
    this.track('form_start', {
      form: formName,
      timestamp: Date.now()
    });
  }

  trackFormSubmit(formName, formData = {}) {
    this.track('form_submit', {
        form: formName,
        // ← Datos que se usarán para actualizar el Prospect (nivel superior)
        ...formData  // Esto expande los datos al nivel raíz
    });
  }

  trackFormError(formName, errors) {
    this.track('form_error', {
      form: formName,
      errors: errors
    });
  }

  // 4. Embudos (Funnels)
  trackFunnelStep(funnelName, stepNumber, stepName, additionalData = {}) {
    this.track('funnel_step', {
      funnel: funnelName,
      step: stepNumber,
      step_name: stepName,
      ...additionalData
    });
  }

  trackFunnelComplete(funnelName, conversionData = {}) {
    this.track('funnel_complete', {
      funnel: funnelName,
      conversion_data: conversionData
    });
  }

  trackFunnelExit(funnelName, exitStep, reason = null) {
    this.track('funnel_exit', {
      funnel: funnelName,
      exit_step: exitStep,
      reason: reason
    });
  }

  // 5. Scroll tracking
  setupScrollTracking() {
    let scrollDepth = 0;
    let scrollCheckpoints = [25, 50, 75, 100];
    
    window.addEventListener('scroll', this.debounce(() => {
      const percent = Math.round(
        (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
      );
      
      scrollCheckpoints.forEach(checkpoint => {
        if (percent >= checkpoint && scrollDepth < checkpoint) {
          scrollDepth = checkpoint;
          this.trackScroll(checkpoint);
        }
      });
    }, 500));
  }

  trackScroll(depth) {
    this.track('scroll_depth', {
      depth: depth,
      page: window.location.pathname
    });
  }

  // 6. Videos
  trackVideoStart(videoName) {
    this.track('video_start', {
      video_name: videoName,
    });
  }

  trackVideoPause(videoName, percentagePlayed) {
    let storageVideoName = `video-${videoName}-percentage-viewed`
    sessionStorage.setItem(storageVideoName,percentagePlayed)
    this.track('video_pause', {
      video_name: videoName,
      percentage_played: percentagePlayed
    });
  }

  trackVideoProgress(videoName, timeViewed){
    this.track('video_progress',{
      video_name: videoName,
      time_viewed: timeViewed
    })
  }

  trackVideoComplete(videoName, duration) {
    this.track('video_complete', {
      video_name: videoName,
      duration: duration
    });
  }

  // 7. CTA (Call to Action)
  trackCTA(ctaName, ctaType, position = null) {
    this.track('cta_click', {
      cta_name: ctaName,
      cta_type: ctaType,
      position: position
    });
  }

  // 8. Búsquedas
  trackSearch(query, resultsCount = null) {
    this.track('search', {
      query: query,
      results_count: resultsCount
    });
  }

  // 9. Descargas
  trackDownload(fileName, fileType) {
    this.track('download', {
      file_name: fileName,
      file_type: fileType,
    });
  }

  // 10. Tiempo en página (exit)
  setupExitTracking() {
    window.addEventListener('beforeunload', () => {
      const timeOnPage = Math.round((Date.now() - this.pageLoadTime) / 1000);
      this.track('page_exit', {
        time_on_page: timeOnPage,
        path: window.location.pathname
      });
    });

    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        const timeOnPage = Math.round((Date.now() - this.pageLoadTime) / 1000);
        this.track('page_exit', {
          time_on_page: timeOnPage,
        });
      };  
    })
  }

  // 11. Errores de la aplicación
  trackError(errorType, errorMessage, errorContext = {}) {
    this.track('error', {
      type: errorType,
      message: errorMessage,
      context: errorContext,
      url: window.location.href
    });
  }

  // 12. Conversiones personalizadas
  trackConversion(conversionType, value = null, metadata = {}) {
    this.track('conversion', {
      type: conversionType,
      value: value,
      metadata: metadata
    });
  }

  // 13. Engagement de contenido
  trackContentEngagement(contentId, contentType, engagementType) {
    this.track('content_engagement', {
      content_id: contentId,
      content_type: contentType,
      engagement_type: engagementType
    });
  }

  // 14. A/B Testing
  trackExperiment(experimentName, variant) {
    this.track('experiment_view', {
      experiment: experimentName,
      variant: variant
    });
  }

  // ============= MÉTODO BASE =============
  
  async track(action, details = {}) { 
    try {
        const payload = {
            session_id: sessionStorage.getItem('analytics-session'),
            id_ref: sessionStorage.getItem('id-ref'),
            action: action,
            prospect_id: localStorage.getItem('prospect-id'),
            user_agent: navigator.userAgent,
            url: window.location.href,
            timestamp: new Date().toISOString(),
            
            // ← IMPORTANTE: Los datos del formulario deben estar aquí en el nivel raíz
            first_name: details.first_name || undefined,
            last_name: details.last_name || undefined,
            email: details.email || undefined,
            phone: details.phone || undefined,
            departamento: details.departamento || undefined,
            country: details.country || localStorage.getItem('prospect-country') || 'Bolivia',
            
            // Detalles adicionales
            details: details
        };

        const response = await fetch(`${this.endpoint}/dashboard/prospect-actions`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
            keepalive: true
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        
        if (data.referer_image && 
            !data.referer_image.toLowerCase().includes('none')) {
            sessionStorage.setItem('referrer_image', data.referer_image);
        }
        if (data.phone_number) {
            sessionStorage.setItem('referrer_whatsapp', data.phone_number);
        }
        
        return data;

    } catch (e) {
        console.error('Analytics error:', e);
        throw e;
    }
 }

  async checkProspectData() {
    if (typeof window === 'undefined') {
        return {
            exists: false,
            has_complete_data: false,
            prospect: null
        };
    }
    
    try {
        const prospectId = localStorage.getItem('prospect-id');
        
        if (!prospectId) {
            console.log('⚠️ No prospect_id found in localStorage');
            return {
                exists: false,
                has_complete_data: false,
                prospect: null
            };
        }

        console.log('🔍 Checking prospect:', prospectId);

        const response = await fetch(
            `${this.endpoint}/dashboard/prospect-check/?prospect_id=${prospectId}`,
            {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            }
        );

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('✅ Prospect data received:', data);
        return data;

    } catch (error) {
        console.error('❌ Error checking prospect:', error);
        return {
            exists: false,
            has_complete_data: false,
            prospect: null
        };
    }
}
}

// ← NO inicializar automáticamente
const analytics = new Analytics('http://localhost:8000');

// NO HACER ESTO:
// document.addEventListener('DOMContentLoaded', () => {
//   analytics.trackPageView();
// });

export default analytics;