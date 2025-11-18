# UX Design Specification: INAMSOS

**Date:** 2025-11-17
**Author:** Yoppi
**UX Designer:** Sally
**Project:** Database Tumor Nasional untuk kolegium Indonesia
**Status:** In Progress

---

## Project Vision

### Executive Summary

INAMSOS transforms kolegium cancer research capabilities from scattered, siloed data into a centralized real-time intelligence system that enables groundbreaking research, predictive analytics, and evidence-based policy decisions across Indonesia.

### Target Users Summary

**Primary User Roles (4 distinct types):**
1. **Data Entry Staff** - Local center staff inputting patient data
2. **Researchers** - Academic researchers accessing data for studies
3. **Center Administrators** - Managing centers and approving requests
4. **National Stakeholders** - Leadership viewing strategic intelligence

### Platform & Domain Context

**Platform:** Multi-tenant SaaS web application
**Domain:** Healthcare with strict compliance and privacy requirements
**Complexity:** HIGH - Medical data, multi-role permissions, real-time analytics

---

## Core Experience and Platform

### Primary User Actions

**Most Critical User Actions:**
- **Data Entry:** Staff inputting standardized tumor data with medical accuracy
- **Data Discovery:** Researchers browsing and requesting research datasets
- **Request Approval:** Administrators reviewing and approving data access requests
- **Intelligence Viewing:** Leadership accessing strategic cancer pattern insights

**Effortless Experiences to Design:**
- Progressive form design that guides staff through complex medical data entry
- Intuitive research discovery with geographic visualization and filtering
- Clear approval workflows with proper audit trails and compliance
- Actionable intelligence dashboards with drill-down capabilities

### Platform Deployment

**Primary Platform:** Web-based responsive application (WEB-FIRST)
**Device Support:**
- **Desktop (Primary):** Full-featured workstations for staff, researchers, and administrators
- **Tablet (Secondary):** Field data entry and mobile access for clinicians
- **Mobile (Tertiary):** Quick status checks, notifications, and basic viewing for leadership

**Responsive Strategy:**
- Desktop: Optimized for complex medical workflows and data visualization
- Mobile: Simplified interfaces focused on status viewing and quick actions
- Progressive enhancement: Full features on desktop, essential features on mobile

---

## Desired Emotional Response

### User Experience Goals

**Core Emotional Theme: IMPACT & RECOGNITION**

**Data Entry Staff:** **Visible Impact Contributor**
- Feel that every data entry contributes to national cancer research
- See tangible recognition for data quality and completeness
- Experience pride in being part of nationwide research movement
- Feel appreciated by research community when their data leads to discoveries

**Researchers:** **Impact-Driven Discovery**
- Feel empowered to make breakthrough discoveries with national data
- Experience excitement when finding patterns that could save lives
- Gain recognition through publications and citations using INAMSOS data
- Feel connected to community of researchers making real impact

**Administrators:** **Strategic Gatekeeper Impact**
- Feel crucial in enabling life-changing research through approvals
- Experience recognition for maintaining data integrity and compliance
- See direct impact of their decisions on research advancement
- Feel valued as protectors of both privacy and scientific progress

**Leadership:** **National Policy Impact**
- Feel empowered to make data-driven decisions that save lives
- Experience recognition for improving Indonesia's cancer outcomes
- See tangible impact of policies on national health metrics
- Feel pride in showcasing Indonesia's research leadership globally

---

## Inspiration Analysis

### Key Inspiration: WhatsApp Group Dokter

**Why Medical Staff Love WhatsApp:**
- **Instant Communication:** Real-time sharing of medical cases and insights
- **Efficient Sharing:** Quick photo sharing, case discussions, knowledge exchange
- **Trusted Network:** Known colleagues, professional context
- **Mobile-First:** Accessible anywhere, anytime
- **Simple Interface:** Focus on conversation, not complex features

**Critical UX Elements:**
- **Immediate Feedback:** Message sent/delivered/read receipts
- **Rich Media:** Easy photo/document sharing
- **Threaded Conversations:** Organized discussions by topic
- **Quick Actions:** Forward, reply, react - minimal cognitive load

### Additional System Inspirations

**Research Platforms:**
- **PubMed** - Search and discovery for medical research
- **Tableau Public** - Data visualization and analytics
- **Kaggle** - Dataset discovery and research collaboration
- **Google Scholar** - Research publication tracking

**Dashboard Systems:**
- **Grafana** - Real-time monitoring dashboards
- **PowerBI** - Business intelligence visualization
- **WHO Health Data** - Public health data presentation

### UX Patterns to Adapt from WhatsApp

**Communication-Inspired Data Entry:**
- **Real-time Status:** Clear feedback for data entry completion
- **Rich Media Support:** Easy medical imaging/document upload
- **Threaded Organization:** Group related data logically
- **Quick Actions:** Common tasks easily accessible

**Medical Data Entry Principles:**
- **Efisien:** Data tepat di isi tanpa ribet
- **User-Friendly:** Intuitive, tidak perlu training panjang
- **Membantu Presisi:** Support untuk accuracy medical data
- **Mobile-Friendly:** Dapat diisi dari device apapun

**Healthcare Best Practices:**
- Progressive disclosure untuk complex medical forms
- Clear medical terminology dengan contextual help
- Robust validation dengan gentle error prevention
- Accessibility compliance untuk diverse medical staff

**Research System Patterns:**
- Advanced filtering dan search capabilities
- Geographic data visualization
- Collaboration dan sharing features
- Data export dalam standard formats

**Dashboard Intelligence:**
- Clear visual hierarchy untuk metrics
- Drill-down capabilities dari overview ke detail
- Real-time updates dan notifications
- Impact recognition untuk user contributions

---

## Project Complexity Assessment

### UX Complexity Indicators

**High Complexity Factors:**
- **4 Distinct User Roles:** Each with unique workflows, permissions, and priorities
- **Multi-tenant Architecture:** Multiple centers with data isolation and sharing
- **Medical Compliance:** Strict privacy, security, and validation requirements
- **Real-time Analytics:** Live dashboards with geographic and temporal data
- **Document Management:** Medical images and attachments with validation

**Design Strategy:**
- Role-based interface design with clear permission boundaries
- Progressive disclosure for complex medical forms
- Visual hierarchy for dashboards and intelligence
- Responsive design for various device contexts
- Accessibility as core requirement, not optional

**Facilitation Mode:** UX_INTERMEDIATE
- Balance design concepts with clear explanations
- Provide brief context for UX decisions
- Use familiar analogies when helpful
- Confirm understanding at key points

---

## Visual Foundation

### Design System Decision

**Chosen Theme:** Professional Medical Green
**Palette Selection:** Classic medical green with modern clean aesthetics
**Rationale:** Instantly recognizable as healthcare system, conveys trust and professionalism

### Color System

**Primary Colors:**
- **Primary Green:** #10b981 (Main actions, key CTAs, navigation)
- **Secondary Green:** #059669 (Secondary actions, emphasis)
- **Success:** #059669 (Data saved, validation success)

**Semantic Colors:**
- **Warning:** #f59e0b (Alerts, cautions)
- **Error:** #ef4444 (Validation errors, critical issues)
- **Info:** #3b82f6 (Information, help text)

**Neutral Scale:**
- **Light Backgrounds:** #f0fdf4, #dcfce7 (Medical clean feel)
- **Text:** #052e16 (High contrast for readability)
- **Borders:** #e5e7eb (Subtle separation)

### Typography System

**Font Family:** Inter (or system fallbacks) - Clean, modern, highly readable
**Type Scale:**
- **Headings:** 700 weight, tight line-height
- **Body:** 400-500 weight, generous line-height for medical reading
- **Small Text:** 500 weight, clear visibility

### Spacing Foundation

**Base Unit:** 8px (0.5rem) system
**Scale:** 4px, 8px, 12px, 16px, 24px, 32px, 48px, 64px
**Usage:** Consistent spacing for medical form layouts and dashboards

---

## Design Direction

### Core UX Principles

**WhatsApp-Inspired Communication:**
- Real-time status feedback (sent/delivered/read patterns)
- Rich media support for medical imaging
- Threaded organization for related medical data
- Quick actions with minimal cognitive load

**Medical Precision & Trust:**
- Progressive disclosure for complex forms
- Clear medical terminology with contextual help
- Robust validation with gentle error prevention
- Professional medical aesthetic with clean design

### Component Strategy

**From Design System:**
- Standard UI components (buttons, forms, modals)
- Accessibility compliance built-in
- Responsive patterns
- Icon library for medical symbols

**Custom Components Needed:**
- Medical data entry forms with validation
- Geographic cancer visualization components
- Multi-level approval workflow components
- Real-time dashboard widgets

---

## Design Direction Decisions

### Selected Design Approaches

**Data Entry Interface: Direction 6 - Workflow-Oriented**
- **Rationale:** Step-by-step guided process with clear progression
- **Key Features:** Multi-step workflow, progress indicators, comprehensive validation
- **Benefits:** Reduces cognitive load for medical staff, ensures data completeness, scalable for complex forms

**Research Discovery Interface: Direction 3 - Research Hub**
- **Rationale:** Study-focused with collaboration tools and research workflows
- **Key Features:** Active studies management, dataset browsing, collaboration features
- **Benefits:** Supports academic research process, enables team collaboration, study-focused organization

**Approval Workflow Interface: Direction 1 - Approval Dashboard**
- **Rationale:** Clear status tracking with traditional approval workflows
- **Key Features:** Queue management, decision tools, audit trails
- **Benefits:** Efficient processing, clear compliance tracking, professional medical interface

**Leadership Dashboard Interface: Direction 1 - Strategic Overview**
- **Rationale:** High-level insights with decision support for leadership
- **Key Features:** National metrics, trend analysis, regional performance
- **Benefits:** Strategic intelligence, policy support, executive-ready views

### Core Design Principles Applied

**WhatsApp-Inspired Communication Patterns:**
- Real-time status feedback across all interfaces
- Clean, accessible design with minimal cognitive load
- Quick actions with clear visual feedback
- Mobile-optimized where appropriate

**Medical Precision & Trust:**
- Professional aesthetics that convey healthcare expertise
- Robust validation and error prevention
- Clear medical terminology with contextual help
- High contrast for readability and accessibility

### Technical Implementation Strategy

**Component Library Strategy:**
- Base components from professional design system
- Custom medical data entry components with validation
- Geographic visualization components for research
- Workflow components for approval processes
- Dashboard widgets for leadership intelligence

**Responsive Design Approach:**
- Desktop-first with comprehensive medical workflow support
- Tablet-optimized for field data entry
- Mobile-optimized for status checks and quick actions
- Progressive enhancement ensures essential functionality on all devices

---

## Current Status

**Phase:** Design Directions Complete
**Next Step:** User Journey Design & Component Specification
**Readiness:** Ready to document detailed UX patterns and implement development