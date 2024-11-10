using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using OM_ScheduleTool.Models;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
//using System.Data.SqlClient;
using Microsoft.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;
using AppContext = OM_ScheduleTool.Models.AppContext;

namespace OM_ScheduleTool.Repositories
{
    public class DealpointRepository : IDealpointRepository
    {
        private AppContext _context;
        private ILogger<DealpointRepository> _logger;
        private IUserRepository _userRepository;

        public DealpointRepository(AppContext context
            , IUserRepository userRepository
            , ILogger<DealpointRepository> logger)
        {
            _context = context;
            _logger = logger;
            _userRepository = userRepository;
        }

        public Dealpoint GetDealpoint (int NetworkId, int PlanYr, string DR)
        {
            return _context.DealPoints
                .Where (d => d.DR == DR && d.NetworkId == NetworkId && d.PlanYr == PlanYr)               
                .FirstOrDefault<Dealpoint>();
        }

        public bool SetDealpoint(int LoggedOnUserId, int NetworkId, int PlanYr, string DR, string CancelLine1, string CancelLine2, string CancelLine3, string CancelLine4, string CancelLine5)
        {
            try
            {
                User LoggedOnUser = _userRepository.GetUserById(LoggedOnUserId);
                bool Update = false;
                Dealpoint dp = GetDealpoint(NetworkId, PlanYr, DR);
                if (dp != null)
                {
                    if (dp.BillboardAddedValue != CancelLine1)
                    {
                        Update = true;
                        dp.BillboardAddedValue = CancelLine1;
                        dp.UpdateDt = DateTime.Now;
                        dp.UpdatedBy = LoggedOnUser;
                    }

                    if (dp.UpfrontSponsorship != CancelLine2)
                    {
                        Update = true;
                        dp.UpfrontSponsorship = CancelLine2;
                        dp.UpdateDt = DateTime.Now;
                        dp.UpdatedBy = LoggedOnUser;
                    }

                    if (dp.UpfrontCancellation != CancelLine3)
                    {
                        Update = true;
                        dp.UpfrontCancellation = CancelLine3;
                        dp.UpdateDt = DateTime.Now;
                        dp.UpdatedBy = LoggedOnUser;
                    }

                    if (dp.ScatterCancellation != CancelLine4)
                    {
                        Update = true;
                        dp.ScatterCancellation = CancelLine4;
                        dp.UpdateDt = DateTime.Now;
                        dp.UpdatedBy = LoggedOnUser;
                    }

                    if (dp.NetworkSeparationPolicy != CancelLine5)
                    {
                        Update = true;
                        dp.NetworkSeparationPolicy = CancelLine5;
                        dp.UpdateDt = DateTime.Now;
                        dp.UpdatedBy = LoggedOnUser;
                    }

                    if (Update == true)
                    {
                        _context.Entry(dp).State = Microsoft.EntityFrameworkCore.EntityState.Modified;
                        _context.SaveChanges();
                    }

                }
                else
                {
                    dp = new Dealpoint();
                    dp.NetworkId = NetworkId;
                    dp.PlanYr = PlanYr;
                    dp.DR = DR;
                    dp.BillboardAddedValue = CancelLine1;
                    dp.UpfrontSponsorship = CancelLine2;
                    dp.UpfrontCancellation = CancelLine3;
                    dp.ScatterCancellation = CancelLine4;
                    dp.NetworkSeparationPolicy = CancelLine5;
                    dp.CreateDt = DateTime.Now;
                    dp.UpdateDt = DateTime.Now;
                    dp.UpdatedBy = LoggedOnUser;

                    _context.DealPoints.Add(dp);
                    _context.SaveChanges();

                }
                return true;
            }
            catch (Exception exc)
            {
                throw exc;
            }
        }
    }
}
