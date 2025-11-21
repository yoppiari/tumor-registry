"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResearchModule = void 0;
const common_1 = require("@nestjs/common");
const research_controller_1 = require("./research.controller");
const research_service_1 = require("./research.service");
const research_controller_sprint3_1 = require("./research.controller.sprint3");
const research_service_sprint3_1 = require("./research.service.sprint3");
const research_discovery_controller_1 = require("./controllers/research-discovery.controller");
const advanced_search_service_1 = require("./services/advanced-search.service");
const collaboration_service_1 = require("./services/collaboration.service");
const research_planning_service_1 = require("./services/research-planning.service");
const database_module_1 = require("../../database/database.module");
const auth_module_1 = require("../auth/auth.module");
let ResearchModule = class ResearchModule {
};
exports.ResearchModule = ResearchModule;
exports.ResearchModule = ResearchModule = __decorate([
    (0, common_1.Module)({
        imports: [database_module_1.DatabaseModule, auth_module_1.AuthModule],
        controllers: [
            research_controller_1.ResearchController,
            research_controller_sprint3_1.ResearchSprint3Controller,
            research_discovery_controller_1.ResearchDiscoveryController,
        ],
        providers: [
            research_service_1.ResearchService,
            research_service_sprint3_1.ResearchSprint3Service,
            advanced_search_service_1.AdvancedSearchService,
            collaboration_service_1.CollaborationService,
            research_planning_service_1.ResearchPlanningService,
        ],
        exports: [
            research_service_1.ResearchService,
            research_service_sprint3_1.ResearchSprint3Service,
            advanced_search_service_1.AdvancedSearchService,
            collaboration_service_1.CollaborationService,
            research_planning_service_1.ResearchPlanningService,
        ],
    })
], ResearchModule);
//# sourceMappingURL=research.module.js.map